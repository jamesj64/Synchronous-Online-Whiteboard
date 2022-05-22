<?php
if(isset($_POST['data'])){
  $fp = fopen('board.json','w');
  fwrite($fp,json_encode($_POST['data']));
  fclose($fp);
}
?>
