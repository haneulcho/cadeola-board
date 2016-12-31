<?php
	define('__ZBXE__', true);
	require_once $_SERVER['DOCUMENT_ROOT'].'/xe/config/config.inc.php';
	$oContext = &Context::getInstance();
	$oContext->init();
    
	// XE로부터 ajax 변수 받아오기
	$module_srl = $_POST[module_srl]; 
	$document_srl = $_POST[document_srl]; 
	$member_srl = $_POST[member_srl]; 
	$ipaddress = $_SERVER[REMOTE_ADDR]; 
	$star = $_POST[star];
	if($member_srl) $member_srl = $_POST[member_srl];
	else $member_srl = $_SERVER[REMOTE_ADDR];

	// 받아온 document_srl 존재하는지 확인
	$oDB = &DB::getInstance();
	$oSql = $oDB->_query("select member_srl, ipaddress, title from xe_documents where document_srl='$document_srl'");
	$hasDocument = $oDB->_fetch($oSql);
	$hasTitle = $hasDocument->title;
    $hasDocMember = $hasDocument->member_srl;
    $hasDocIp = $hasDocument->ipaddress;

	// 없는 글이면
	if(!$hasDocument) die("존재하지 않거나 삭제된 글이에요.");

	// 내 글이면 별점 평가 X
	// if($hasDocMember==$member_srl || $hasDocIp==$member_srl) die("자신의 글은 평가할 수 없습니다.");

	// 받아온 document_srl에 해당하는 별점 데이터 불러오기
	$oDB = &DB::getInstance();
	$sql = $oDB->_query("select * from xe_document_star_log where document_srl='$document_srl'");
	$rating = $oDB->_fetch($sql);
    $star_data = $rating->star_data;
    $star_average = $rating->star_average;
	$star_ip = $rating->ipaddress;
	
	// 이미 평가한 ip는 별점 평가 X
	if(strpos($star_ip, $ipaddress)!==false) die("이미 별점 평가에 참여하셨어요. (동일 ip 기준 1회 평가 가능)");

	// 기존 별점 확인해서 있으면 if 없으면 else
    if($star_data) {
		$star_average = (array_sum(explode(",",$star_data))+$star)/(sizeof(explode(",",$star_data))+1);
		$sql = "update xe_document_star_log set module_srl='$module_srl', document_srl='$document_srl', star_average='$star_average', star_data=CONCAT(star_data, ',$star'), ipaddress=CONCAT(ipaddress, ',$ipaddress'), star_list=CONCAT(star_list, ',$member_srl') where document_srl='$document_srl'";
		$sql2 = "update xe_documents set star_average='$star_average' where document_srl='$document_srl'";
    } else {
		$sql = "insert into xe_document_star_log set module_srl='$module_srl', document_srl='$document_srl', ipaddress='$ipaddress', star_average='$star', star_data='$star', star_list='$member_srl'";
		$sql2 = "update xe_documents set star_average='$star' where document_srl='$document_srl'";
    }
	
	$last_update = date('YmdHis');
	$sql3 = "update xe_documents set last_update='$last_update' where document_srl='$document_srl'";
	
	$oDB->_query($sql);
	$oDB->_query($sql2);
	$oDB->_query($sql3);
	
	$oDB = &DB::getInstance();
	$query = $oDB->_query("select star_data, star_average from xe_document_star_log where document_srl = '$document_srl'");
	$rating = $oDB->_fetch($query);
	$star_data = $rating->star_data;
    $star_average = $rating->star_average;
    $rating_count = sizeof(explode(",", $star_data));
    $rating_average = sprintf("%.1f", $star_average);
	
	// 완료시 새로운 값 인클루드
	$successMsg = "'{$hasTitle}'에 {$star}점이 반영되었습니다!"; 
	$successTitle = "'{$hasTitle}'에 <strong>{$star}점</strong>이 반영되었습니다!";
	include $_SERVER["DOCUMENT_ROOT"]."/xe/modules/board/skins/cadeola_board/_star_success_inview.php";
?>