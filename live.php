<?php

$ch = curl_init();
$url = "https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v0001/";
$d = '';
$params['format'] = 'json';
$params['key'] = "A296FD8E719DC45285F6D0BCE0AD7BC9";
foreach ($params as $key=>$value) {
    $d .= $key.'='.$value.'&';
}
$d = rtrim($d, '&');
$url .= '?'.$d;

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_ENCODING , "gzip");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

$r = curl_exec($ch);
curl_close($ch);

echo $r;
