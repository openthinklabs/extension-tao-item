<div id="<?=$identifier?>" class="qti_widget qti_<?=$_type?>_interaction">
	<?=$data?>
</div>	
<script type="text/javascript">
	qti_initParam["<?=$serial?>"] = {
		id : "<?=$identifier?>",
		type : "qti_<?=$_type?>_interaction"
		<?foreach($options as $key => $value):?>
			, "<?=$key?>" : "<?=$value?>"
		<?endforeach?>
	};
</script>