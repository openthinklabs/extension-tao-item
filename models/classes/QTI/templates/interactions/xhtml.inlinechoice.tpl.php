<select id="<?=$identifier?>" name="<?=$identifier?>" class="qti_<?=$_type?>_interaction">
	<?=$data?>
</select>
<script type="text/javascript">
	qti_initParam["<?=$serial?>"] = {
		id : "<?=$identifier?>",
		type : "qti_<?=$_type?>_interaction"
		<?foreach($options as $key => $value):?>
			, "<?=$key?>" : "<?=$value?>"
		<?endforeach?>
	};
</script>