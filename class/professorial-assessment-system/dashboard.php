<?php
require_once 'config/database.php';
require_once 'includes/auth.php';

requireLogin();

$database = new Database();
$db = $database->getConnection();
$user = getCurrentUser();

// Get statistics
$stats = [];

// Total professors
$query = "SELECT COUNT(*) as count FROM professors";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['professors'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Total assessments
$query = "SELECT COUNT(*) as count FROM assessments";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['assessments'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Completed assessments
$query = "SELECT COUNT(*) as count FROM assessments WHERE status = 'completed'";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['completed'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Pending assessments
$query = "SELECT COUNT(*) as count FROM assessments WHERE status IN ('draft', 'submitted')";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['pending'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Recent assessments
$query = "SELECT a.*, u1.full_name as professor_name, u2.full_name as evaluator_name 
          FROM assessments a 
          JOIN professors p ON a.professor_id = p.id 
          JOIN users u1 ON p.user_id = u1.id 
          JOIN users u2 ON a.evaluator_id = u2.id 
          ORDER BY a.created_at DESC LIMIT 5";
$stmt = $db->prepare($query);
$stmt->execute();
$recent_assessments = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Professorial Assessment System</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-container">
                <a href="dashboard.php" class="nav-brand">Assessment System</a>
                <ul class="nav-menu">
                    <li><a href="dashboard.php">Dashboard</a></li>
                    <?php if (hasRole('admin') || hasRole('evaluator')): ?>
                        <li><a href="assessments.php">Assessments</a></li>
                        <li><a href="professors.php">Professors</a></li>
                    <?php endif; ?>
                    <?php if (hasRole('admin')): ?>
                        <li><a href="criteria.php">Criteria</a></li>
                        <li><a href="users.php">Users</a></li>
                    <?php endif; ?>
                    <li><a href="reports.php">Reports</a></li>
                    <li><a href="logout.php">Logout (<?php echo htmlspecialchars($user['full_name']); ?>)</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container dashboard">
        <div class="dashboard-header">
            <h1>Welcome, <?php echo htmlspecialchars($user['full_name']); ?></h1>
            <p>Role: <?php echo ucfirst($user['role']); ?></p>
        </div>

        <div class="dashboard-stats">
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['professors']; ?></div>
                <div class="stat-label">Total Professors</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['assessments']; ?></div>
                <div class="stat-label">Total Assessments</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['completed']; ?></div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo $stats['pending']; ?></div>
                <div class="stat-label">Pending</div>
            </div>
        </div>

        <div class="table-container">
            <h2 style="padding: 20px; margin: 0; background-color: #f8f9fa; border-bottom: 1px solid #eee;">Recent Assessments</h2>
            <?php if (empty($recent_assessments)): ?>
                <div style="padding: 40px; text-align: center; color: #666;">
                    <p>No assessments found.</p>
                    <?php if (hasRole('admin') || hasRole('evaluator')): ?>
                        <a href="assessments.php?action=create" class="btn btn-primary">Create New Assessment</a>
                    <?php endif; ?>
                </div>
            <?php else: ?>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Professor</th>
                            <th>Evaluator</th>
                            <th>Period</th>
                            <th>Status</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recent_assessments as $assessment): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($assessment['professor_name']); ?></td>
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
                                    <a href="assessment_view.php?id=<?php echo $assessment['id']; ?>" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">View</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px;">
            <?php if (hasRole('admin') || hasRole('evaluator')): ?>
                <div class="feature-card">
                    <h3>Create Assessment</h3>
                    <p>Start a new professor assessment process.</p>
                    <a href="assessments.php?action=create" class="btn btn-primary">Create New</a>
                </div>
            <?php endif; ?>
            
            <div class="feature-card">
                <h3>View Reports</h3>
                <p>Generate and view assessment reports.</p>
                <a href="reports.php" class="btn btn-primary">View Reports</a>
            </div>
            
            <?php if (hasRole('admin')): ?>
                <div class="feature-card">
                    <h3>Manage Criteria</h3>
                    <p>Configure assessment criteria and weights.</p>
                    <a href="criteria.php" class="btn btn-primary">Manage</a>
                </div>
            <?php endif; ?>
        </div>
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
