<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<?php
	$title = get_bloginfo('name');
?>
<title><?php echo $title; ?></title>

<?php wp_head(); ?>

</head>

<body <?php wkny_get_body_data(); ?>>