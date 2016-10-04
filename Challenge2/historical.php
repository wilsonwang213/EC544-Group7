<?php
$q = $_GET['q'];

$con = mysqli_connect('localhost','root','19940213','ec544');
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}
$data="SELECT * FROM temperature WHERE Date = '".$q."'";
$result = mysqli_query($con,$data);
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}

echo json_encode($rows);
exit;
mysqli_close($con);
?>


