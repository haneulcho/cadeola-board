<script type="text/javascript">
	alert ("<?=$successMsg?>");
	var rating_average = <?=$rating_average?>;
	var hastitle = "<?=$successTitle?>";
	
</script>	
		<?php for($j=1;$j<=floor($rating_average);$j++) {?><img src="http://cadeola.com/xe/layouts/cadeola_layout/images/star/s<?=$j%2?"1":"2"?>1.png" id="stars_img{$m}_{$document_srl}_inview" onClick="alert('이미 별점 평가에 참여하셨어요. (동일 ip 기준 1회 평가 가능)')" /><?}?><?php for($j=floor($rating_average)+1;$j<=10;$j++) {?><img src="http://cadeola.com/xe/layouts/cadeola_layout/images/star/s<?=$j%2?"1":"2"?>0.png" id="stars_img{$m}_{$document_srl}_inview" onClick="alert('이미 별점 평가에 참여하셨어요. (동일 ip 기준 1회 평가 가능)')" /><?}?><span id="stars_comment_{$document_srl}_inview"><?=$rating_average?></span>