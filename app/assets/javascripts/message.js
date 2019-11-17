$(function(){
  function buildHTML(message) {
    var content = message.content ? `${ message.content }` : "";
    var img = message.image ? `<img src= ${ message.image }>` : "";
    var html = `<div class="message" data-id="${message.id}">
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                      ${ message.user_name }
                    </div>
                    <div class="upper-message__date">
                      ${ message.date }
                    </div>
                  </div>
                  <div class="lower-message">
                    <p class="lower-message__content">
                    ${ content }
                    </p>
                    ${ img }
                  </div>
                </div>`;
  return html;
  }
  function scrollBottom(message){
    var target = $('.message').last();
    var position = target.offset().top + $('.messages').scrollTop();
    $('.messages').animate({
      scrollTop: position
    }, 300, 'swing');
  }
  $('#new_message').on('submit' , function(e){
    e.preventDefault(); //フォーム送信の同期通信のイベントをキャンセルさせるために書いています。
    var formData = new FormData(this);  //フォームに入力した値を取得。var message?
    var url = $(this).attr('action'); //?POSTリクエストを送りたいルーティング
    $.ajax({
      url: url, //同期通信でいう『パス』
      type: "POST", //同期通信でいう『HTTPメソッド』
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('#new_message')[0].reset();
      var html = scrollBottom(data);
    })
    .fail(function(data){
      alert("メッセージ送信に失敗しました");
    })
    .always(function(data){
      $('.form__submit').prop('disabled', false);　//ここで解除している
    })
  });
});