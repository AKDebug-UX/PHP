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

$action = $_GET['action'] ?? 'list';
$success = '';
$error = '';

// Handle form submissions
if ($_POST) {
    if ($action === 'create') {
        $professor_id = $_POST['professor_id'];
        $assessment_period = $_POST['assessment_period'];
        $comments = $_POST['comments'] ?? '';
        
        if (empty($professor_id) || empty($assessment_period)) {
            $error = 'Please fill in all required fields.';
        } else {
            $query = "INSERT INTO assessments (professor_id, evaluator_id, assessment_period, comments, status) VALUES (?, ?, ?, ?, 'draft')";
            $stmt = $db->prepare($query);
            
            if ($stmt->execute([$professor_id, $user['id'], $assessment_period, $comments])) {
                $assessment_id = $db->lastInsertId();
                $success = 'Assessment created successfully!';
                header("Location: assessment_form.php?id=$assessment_id");
                exit();
            } else {
                $error = 'Failed to create assessment.';
            }
        }
    }
}

// Get professors for dropdown
$query = "SELECT p.id, u.full_name, p.department FROM professors p JOIN users u ON p.user_id = u.id ORDER BY u.full_name";
$stmt = $db->prepare($query);
$stmt->execute();
$professors = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get assessments
$query = "SELECT a.*, u1.full_name as professor_name, u2.full_name as evaluator_name, p.department 
          FROM assessments a 
          JOIN professors p ON a.professor_id = p.id 
          JOIN users u1 ON p.user_id = u1.id 
          JOIN users u2 ON a.evaluator_id = u2.id 
          ORDER BY a.created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$assessments = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assessments - Professorial Assessment System</title>
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
            <h1>Assessment Management</h1>
            <div style="display: flex; gap: 10px; align-items: center;">
                <?php if ($action !== 'create'): ?>
                    <a href="assessments.php?action=create" class="btn btn-primary">Create New Assessment</a>
                <?php endif; ?>
                <?php if ($action === 'create'): ?>
                    <a href="assessments.php" class="btn btn-secondary">Back to List</a>
                <?php endif; ?>
            </div>
        </div>

        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
        <?php endif; ?>

        <?php if ($action === 'create'): ?>
            <div class="assessment-form">
                <h2>Create New Assessment</h2>
                <form method="POST">
                    <div class="form-group">
                        <label for="professor_id">Professor:</label>
                        <select id="professor_id" name="professor_id" class="form-control" required>
                            <option value="">Select Professor</option>
                            <?php foreach ($professors as $professor): ?>
                                <option value="<?php echo $professor['id']; ?>" 
                                        <?php echo (isset($_POST['professor_id']) && $_POST['professor_id'] == $professor['id']) ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($professor['full_name'] . ' - ' . $professor['department']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="assessment_period">Assessment Period:</label>
                        <input type="text" id="assessment_period" name="assessment_period" class="form-control" 
                               placeholder="e.g., Fall 2024, Academic Year 2023-2024" required
                               value="<?php echo isset($_POST['assessment_period']) ? htmlspecialchars($_POST['assessment_period']) : ''; ?>">
                    </div>

                    <div class="form-group">
                        <label for="comments">Initial Comments (Optional):</label>
                        <textarea id="comments" name="comments" class="form-control" rows="4" 
                                  placeholder="Any initial notes or comments about this assessment..."><?php echo isset($_POST['comments']) ? htmlspecialchars($_POST['comments']) : ''; ?></textarea>
                    </div>

                    <div class="form-group">
                        <button type="submit" class="btn btn-success">Create Assessment</button>
                        <a href="assessments.php" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        <?php else: ?>
            <div class="table-container">
                <h2 style="padding: 20px; margin: 0; background-color: #f8f9fa; border-bottom: 1px solid #eee;">All Assessments</h2>
                <?php if (empty($assessments)): ?>
                    <div style="padding: 40px; text-align: center; color: #666;">
                        <p>No assessments found.</p>
                        <a href="assessments.php?action=create" class="btn btn-primary">Create First Assessment</a>
                    </div>
                <?php else: ?>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Professor</th>
                                <th>Department</th>
                                <th>Evaluator</th>
                                <th>Period</th>
                                <th>Status</th>
                                <th>Score</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($assessments as $assessment): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($assessment['professor_name']); ?></td>
                                    <td><?php echo htmlspecialchars($assessment['department']); ?></td>
                                    <td><?php echo htmlspecialchars($assessment['evaluator_name']); ?></td>
                                    <td><?php echo htmlspecialchars($assessment['assessment_period']); ?></td>
                                    <td>
                                        <span class="badge badge-<?php echo $assessment['status']; ?>">
                                            <?php echo ucfirst($assessment['status']); ?>
                                        </span>
                                    </td>
                                    <td><?php echo $assessment['total_score'] ? number_format($assessment['total_score'], 2) : 'N/A'; ?></td>
                                    <td><?php echo date('M j, Y', strtotime($assessment['created_at'])); ?></td>
                                    <td>
                                        <div style="display: flex; gap: 5px;">
                                            <a href="assessment_view.php?id=<?php echo $assessment['id']; ?>" 
                                               class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">View</a>
                                            <?php if ($assessment['status'] === 'draft'): ?>
                                                <a href="assessment_form.php?id=<?php echo $assessment['id']; ?>" 
                                                   class="btn btn-success" style="padding: 5px 10px; font-size: 0.8rem;">Edit</a>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        <?php endif; ?>
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
