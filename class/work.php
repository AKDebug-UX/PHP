<?php
$numbers = [];

for ($i = 1; $i <= 4; $i++) {
    $input = (int)readline("Enter number $i: ");
    $numbers[] = $input;
}

$sum = array_sum($numbers);
$average = $sum / count($numbers);
$product = array_product($numbers);
$max = max($numbers);
$min = min($numbers);

echo "\nResults:\n";
echo "Numbers: " . implode(", ", $numbers) . "\n";
echo "Sum: $sum\n";
echo "Average: $average\n";
echo "Product: $product\n";
echo "Maximum: $max\n";
echo "Minimum: $min\n";
