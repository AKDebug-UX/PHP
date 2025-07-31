<!DOCTYPE html>
<html>
<head>
    <title>Student Information Form</title>
</head>
<body>

<h2>Enter Student Details</h2>

<form method="post" action="">
    <label>Full Name:</label><br>
    <input type="text" name="name" required><br><br>

    <label>Matric Number:</label><br>
    <input type="text" name="matric" required><br><br>

    <label>Phone Number:</label><br>
    <input type="text" name="phone" required><br><br>

    <label>Department:</label><br>
    <input type="text" name="department" required><br><br>

    <input type="submit" name="submit" value="Submit">
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $matric = htmlspecialchars($_POST["matric"]);
    $phone = htmlspecialchars($_POST["phone"]);
    $department = htmlspecialchars($_POST["department"]);

    echo "<h3>Student Information Submitted:</h3>";
    echo "Name: " . $name . "<br>";
    echo "Matric No: " . $matric . "<br>";
    echo "Phone: " . $phone . "<br>";
    echo "Department: " . $department . "<br>";
}
?>

</body>
</html>
