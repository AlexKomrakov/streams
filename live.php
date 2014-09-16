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
//echo $url;
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_ENCODING , "gzip");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// Ignore SSL warnings and questions
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

$r = curl_exec($ch);
curl_close($ch);

echo $r;
//$result = json_decode($r, true);
//foreach ($result['result']['games'] as $game) {
//    if ($game['league_tier'] > 1) {
//        print_r($game['radiant_team']['team_name']);
//        print_r(" " . $game['radiant_series_wins']);
//        print_r("  vs  ");
//        print_r($game['dire_series_wins'] . " ");
//        print_r($game['dire_team']['team_name']);
//        print_r(" (series type: " . $game['series_type'] . ")");
//        $time = (int)$game['scoreboard']['duration'];
//        print_r(" " . date("H:i:s", mktime(0, 0, $time)));
//        print_r(" Radiant score: " . $game['scoreboard']['radiant']['score']);
//        print_r(" Dire score: " . $game['scoreboard']['dire']['score']);
//        print_r("<br>");
//    }
//}

