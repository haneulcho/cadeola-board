<script type="text/javascript">
	alert ("<?=$successMsg?>");
	var rating_average = <?=$rating_average?>;
</script>
    <p class="title">이미 별점 평가에 참여하셨어요~ :D</p>
    <div class="star">
<?php for($j=1;$j<=floor($rating_average);$j++) {?><img src="http://cadeola.com/xe/layouts/cadeola_layout/images/star/s<?=$j%2?"1":"2"?>1.png" onClick="alert('이미 별점 평가에 참여하셨어요. (동일 ip 기준 1회 평가 가능)')" /><?}?><?php for($j=floor($rating_average)+1;$j<=10;$j++) {?><img src="http://cadeola.com/xe/layouts/cadeola_layout/images/star/s<?=$j%2?"1":"2"?>0.png" onClick="alert('이미 별점 평가에 참여하셨어요. (동일 ip 기준 1회 평가 가능)')" /><?}?>
    </div>
    <div class="count">
        <span class="total">(총 <?=$rating_count?>명 참여)</span>
        <span id="stars_comment_{$doc_url}" class="average"><?=$rating_average?>점</span>
    </div>