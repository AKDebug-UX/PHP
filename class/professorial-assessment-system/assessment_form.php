<?php
require_once 'config/database.php';
require_once 'includes/auth.php';

requireLogin();
if (!hasRole('admin') && !hasRole('evaluator')) {
    header('Location: dashboard.php');
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user = getCurrentUser();

$assessment_id = $_GET['id'] ?? 0;
$success = '';
$error = '';

// Get assessment details
$query = "SELECT a.*, u.full_name as professor_name, p.department 
          FROM assessments a 
          JOIN professors p ON a.professor_id = p.id 
          JOIN users u ON p.user_id = u.id 
          WHERE a.id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$assessment_id]);
$assessment = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$assessment) {
    header('Location: assessments.php');
    exit();
}

// Get assessment criteria grouped by category
$query = "SELECT * FROM assessment_criteria ORDER BY category, criteria_name";
$stmt = $db->prepare($query);
$stmt->execute();
$all_criteria = $stmt->fetchAll(PDO::FETCH_ASSOC);

$criteria_by_category = [];
foreach ($all_criteria as $criterion) {
    $criteria_by_category[$criterion['category']][] = $criterion;
}

// Get existing scores
$query = "SELECT * FROM assessment_scores WHERE assessment_id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$assessment_id]);
$existing_scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

$scores = [];
foreach ($existing_scores as $score) {
    $scores[$score['criteria_id']] = $score;
}

// Handle form submission
if ($_POST) {
    $action = $_POST['action'];
    $comments = $_POST['comments'] ?? '';
    
    try {
        $db->beginTransaction();
        
        // Delete existing scores
        $query = "DELETE FROM assessment_scores WHERE assessment_id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$assessment_id]);
        
        // Insert new scores
        $total_weighted_score = 0;
        $total_weight = 0;
        
        foreach ($all_criteria as $criterion) {
            $score = $_POST['score_' . $criterion['id']] ?? 0;
            $score_comments = $_POST['comments_' . $criterion['id']] ?? '';
            
            if ($score > 0) {
                $query = "INSERT INTO assessment_scores (assessment_id, criteria_id, score, comments) VALUES (?, ?, ?, ?)";
                $stmt = $db->prepare($query);
                $stmt->execute([$assessment_id, $criterion['id'], $score, $score_comments]);
                
                $weighted_score = ($score / $criterion['max_score']) * $criterion['weight'] * 100;
                $total_weighted_score += $weighted_score;
                $total_weight += $criterion['weight'];
            }
        }
        
        // Calculate final score
        $final_score = $total_weight > 0 ? $total_weighted_score / $total_weight : 0;
        
        // Update assessment
        $status = ($action === 'submit') ? 'submitted' : 'draft';
        $query = "UPDATE assessments SET total_score = ?, comments = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$final_score, $comments, $status, $assessment_id]);
        
        $db->commit();
        
        if ($action === 'submit') {
            $success = 'Assessment submitted successfully!';
        } else {
            $success = 'Assessment saved as draft.';
        }
        
        // Refresh data
        header("Location: assessment_form.php?id=$assessment_id&success=" . urlencode($success));
        exit();
        
    } catch (Exception $e) {
        $db->rollBack();
        $error = 'Failed to save assessment: ' . $e->getMessage();
    }
}

if (isset($_GET['success'])) {
    $success = $_GET['success'];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assessment Form - Professorial Assessment System</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-container">
                <a href="dashboard.php" class="nav-brand">Assessment System</a>
                <ul class="nav-menu">
                    <li><a href="dashboard.php">Dashboard</a></li>
                    <li><a href="assessments.php">Assessments</a></li>
                    <li><a href="professors.php">Professors</a></li>
                    <?php if (hasRole('admin')): ?>
                        <li><a href="criteria.php">Criteria</a></li>
                        <li><a href="users.php">Users</a></li>
                    <?php endif; ?>
                    <li><a href="reports.php">Reports</a></li>
                    <li><a href="logout.php">Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container dashboard">
        <div class="dashboard-header">
            <h1>Assessment Form</h1>
            <div>
                <strong>Professor:</strong> <?php echo htmlspecialchars($assessment['professor_name']); ?><br>
                <strong>Department:</strong> <?php echo htmlspecialchars($assessment['department']); ?><br>
                <strong>Period:</strong> <?php echo htmlspecialchars($assessment['assessment_period']); ?><br>
                <strong>Status:</strong> <span class="badge badge-<?php echo $assessment['status']; ?>"><?php echo ucfirst($assessment['status']); ?></span>
            </div>
        </div>

        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
        <?php endif; ?>

        <form method="POST" class="assessment-form">
            <?php foreach ($criteria_by_category as $category => $criteria): ?>
                <div class="criteria-section">
                    <h3><?php echo htmlspecialchars($category); ?></h3>
                    
                    <?php foreach ($criteria as $criterion): ?>
                        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
                            <div class="score-input">
                                <label for="score_<?php echo $criterion['id']; ?>">
                                    <?php echo htmlspecialchars($criterion['criteria_name']); ?>:
                                </label>
                                <input type="number" 
                                       id="score_<?php echo $criterion['id']; ?>" 
                                       name="score_<?php echo $criterion['id']; ?>" 
                                       min="0" 
                                       max="<?php echo $criterion['max_score']; ?>" 
                                       step="0.01"
                                       class="form-control"
                                       value="<?php echo isset($scores[$criterion['id']]) ? $scores[$criterion['id']]['score'] : ''; ?>"
                                       style="width: 100px;">
                                <span class="weight-info">
                                    (Max: <?php echo $criterion['max_score']; ?>, Weight: <?php echo $criterion['weight']; ?>)
                                </span>
                            </div>
                            
                            <p style="margin: 10px 0; color: #666; font-size: 0.9rem;">
                                <?php echo htmlspecialchars($criterion['description']); ?>
                            </p>
                            
                            <div class="form-group">
                                <label for="comments_<?php echo $criterion['id']; ?>">Comments:</label>
                                <textarea id="comments_<?php echo $criterion['id']; ?>" 
                                          name="comments_<?php echo $criterion['id']; ?>" 
                                          class="form-control" 
                                          rows="2"
                                          placeholder="Optional comments for this criterion..."><?php echo isset($scores[$criterion['id']]) ? htmlspecialchars($scores[$criterion['id']]['comments']) : ''; ?></textarea>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endforeach; ?>

            <div class="criteria-section">
                <h3>Overall Comments</h3>
                <div class="form-group">
                    <label for="comments">General Assessment Comments:</label>
                    <textarea id="comments" name="comments" class="form-control" rows="5" 
                              placeholder="Overall assessment comments, strengths, areas for improvement, recommendations..."><?php echo htmlspecialchars($assessment['comments']); ?></textarea>
                </div>
            </div>

            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                <button type="submit" name="action" value="save" class="btn btn-secondary">Save as Draft</button>
                <button type="submit" name="action" value="submit" class="btn btn-success" 
                        onclick="return confirm('Are you sure you want to submit this assessment? You will not be able to edit it after submission.')">
                    Submit Assessment
                </button>
                <a href="assessments.php" class="btn btn-primary">Back to Assessments</a>
            </div>
        </form>
    </div>

    <style>
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .badge-draft { background-color: #ffc107; color: #212529; }
        .badge-submitted { background-color: #17a2b8; color: white; }
        .badge-completed { background-color: #28a745; color: white; }
    </style>
</body>
</html>
