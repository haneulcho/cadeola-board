// ajaxFileUpload
jQuery(function($){
	$(document).on({
		mouseenter:function(){ $('.btn_upload_fake').addClass('active');},
		mouseleave:function(){ $('.btn_upload_fake').removeClass('active');}
	}, '#Filedata');

	$(document).on('change', '#Filedata', function(e) {
		e.preventDefault();
		if (document.all && !window.atob) {
			xeUpload();
		} else {
			var files = e.originalEvent.target.files;
			for (var i=0, len=files.length; i<len; i++){
				s = files[i].size;
				var limitMB = 2;
				if (s > limitMB * 1048576) {
					alert('2MB가 넘는 이미지는 첨부할 수 없습니다.');
					return false;
				} else {
					xeUpload();
				}
			}
		}

		function xeUpload() {
			jQuery.ajaxFileUpload({
				url:'index.php?&act=procFileIframeUpload',
				secureuri:false,
				fileElementId:'Filedata',
				dataType:'html',
				data:{
					mid:current_mid,
					editor_sequence: '1',
					uploadTargetSrl: jQuery('#ff input[name=document_srl]').val(),
					manual_insert: 'true'
					},
				success:function(frameId, data, status){
					var frm = document.getElementById('ff');
					var io = document.getElementById(frameId);
					if(io.contentWindow){
						var sourceFile = document.getElementById(frameId).contentWindow.uploaded_fileinfo.source_filename;
						var uploadFile = document.getElementById(frameId).contentWindow.uploaded_fileinfo.uploaded_filename;
						var document_srl = document.getElementById(frameId).contentWindow.uploaded_fileinfo.upload_target_srl;
						var file_srl = document.getElementById(frameId).contentWindow.uploaded_fileinfo.file_srl;
						var sid = document.getElementById(frameId).contentWindow.uploaded_fileinfo.sid;
					} else if(io.contentDocument){
						var sourceFile = document.getElementById(frameId).contentDocument.uploaded_fileinfo.source_filename;
						var uploadFile = document.getElementById(frameId).contentDocument.uploaded_fileinfo.uploaded_filename;
						var document_srl = document.getElementById(frameId).contentDocument.uploaded_fileinfo.upload_target_srl;
						var file_srl = document.getElementById(frameId).contentDocument.uploaded_fileinfo.file_srl;
						var sid = document.getElementById(frameId).contentDocument.uploaded_fileinfo.sid;
					}

					frm.document_srl.value = document_srl;

					// Source from xeed
					ext = (match = uploadFile.match(/\.([a-z0-9]+)$/i))?match[1]||'':'';
					ext = ext.toLowerCase();
					if(jQuery.inArray(ext, 'gif jpg jpeg png'.split(' ')) > -1) type = 'img';
					else if(jQuery.inArray(ext, 'mp3 wma wav ogg aac flac'.split(' ')) > -1) type = 'music';
					else if(jQuery.inArray(ext, 'avi mov mp4 mkv ogv webm'.split(' ')) > -1) type = 'media';
					else type = 'etc';

					if(uploadFile!=""){
						if(type=='img'){
							var insertTag = '<li id="'+file_srl+'" class="success select"><button type="button" style="background-image:url('+uploadFile+')" data-file="'+uploadFile+'" data-type="'+type+'" onclick="jQuery(this).parent().toggleClass(\'select\')" title="'+sourceFile+'"><b>✔</b></button><a href="#" class="cancelfile" onclick="delete_file('+file_srl+');return false"><b>X</b></a></li>';
							jQuery('#files').append(insertTag);
							IsUploadFiles();
						} else {
							alert('이미지가 아닌 파일은 첨부할 수 없습니다.');
						};
					} else {
						alert('첨부 도중 에러가 발생했습니다.');
					}
					if(typeof(data.error)!='undefined'){
						if(data.error!=''){
							alert(data.error);
						} else {
							alert(data.msg);
						}
					}
				},
				error: function (data, status, e){
					alert('첨부 허용 용량(개당 2MB/총 10MB)을 초과했습니다!');
				}
			}); // ajax END
		} // function END

		return false;
	}); // onchange END
}); // jquery END


jQuery(function($){
	$('#nText').on('focus', function(){
		var BoxTxt = $(this).val();
		var Txtregex = /<br\s?\/?>/g;
		BoxTxt = BoxTxt.replace(Txtregex, "\n").replace('src="//', 'src="http://');
		$('#nText').text(BoxTxt);
		$('#nText').val(BoxTxt);
	})

// ColorPicker
	$('.jPicker .Icon').live('mousedown',function(){
		$('#title_color').prev().css('visibility','hidden')
	});
	$('.jPicker.Container .Button input').live('mousedown',function(){
		$('#title_color').prev().click();
	});
});

function fileToTextarea(){

	jQuery(function($){
		jQuery.fn.extend({
		insertAtCaret: function(myValue){
		  return this.each(function(i) {
			if (document.selection) {
			  this.focus();
			  var sel = document.selection.createRange();
			  sel.text = myValue;
			  this.focus();
			}
			else if (this.selectionStart || this.selectionStart == '0') {
			  var startPos = this.selectionStart;
			  var endPos = this.selectionEnd;
			  var scrollTop = this.scrollTop;
			  this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
			  this.focus();
			  this.selectionStart = startPos + myValue.length;
			  this.selectionEnd = startPos + myValue.length;
			  this.scrollTop = scrollTop;
			} else {
			  this.value += myValue;
			  this.focus();
			}
		  });
		}
		}); //END insertAtCaret

		if($('#files .select').length && current_mid != 'dramadb'){
			$('#files .select').each(function(){
				var a = '';
				var b = $('#nText');
				var c = b.val();
				var type = $(this).find('button').attr('data-type');
				if(type=='img'){
					fileSrc = $(this).find('button').attr('data-file');
					if(c.indexOf(fileSrc) == -1) {
						a = a+'<img src="'+fileSrc+'" alt="'+$(this).find('button').attr('title')+'" /><br /><br />';
						c = a+c;
						b.val(c);
					}
				} else {
					alert('이미지가 아닌 파일은 본문에 넣을 수 없습니다.');
					$(this).removeClass('select');
				}
			});
			frmSubmit();
		} else {
			frmSubmit();
		}
	}); //END jQuery
}

function frmSubmit(){
	var a = '';
	var b = jQuery('#nText');
	var c = b.val();
	c = c.replace(/(\r\n|\n)/g, "<br />").replace('src="//', 'src="http://');
	b.val(c);

	if(jQuery('#title_color').length){
		var t = jQuery('#title_color');
		t.val(t.val().replace('#',''));
		if(t.val()=='transparent') {t.val('');}
	}

	var frm = document.getElementById('ff');
	procFilter(frm, insert);
	jQuery('#frmSubmit').attr('disabled','disabled')
}

function delete_file(file_srl){
	var msg = window.confirm(lang_confirm_delete);
	if(msg){
		var settings = file_srl;
		var params = new Array();
		params["editor_sequence"] = 1;
		params["file_srls"]  = file_srl;
		var response_tags = new Array("error","message");
		exec_xml("file","procFileDelete", params, function(){
			jQuery("#"+settings).remove();
			IsUploadFiles()
		})
	} else {
		return false
	}
}

function IsUploadFiles(){
	if(jQuery('#files .success').length){
		jQuery('.msg_upload').addClass('is_img')
	} else {
		jQuery('.msg_upload').removeClass('is_img')
	}
}
