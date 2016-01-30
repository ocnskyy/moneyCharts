<?

header('Content-Type: text/plain');

print file_get_contents("https://api.privatbank.ua/p24api/exchange_rates?json&date=".$_GET['date']);