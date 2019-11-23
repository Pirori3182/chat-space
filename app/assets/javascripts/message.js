$(function(){
  function buildHTML(message) {
    var content = message.content ? `${ message.content }` : "";  //三項演算子を使ってmessage.contentにtrueならcontentに代入
    var img = message.image ? `<img src= ${ message.image }>` : "";  //三項演算子を使ってmessage.imageにtrueならcontentに代入
    var html = `<div class="message" data-message-id=${message.id}>
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
    var target = $('.message').last();  //この時の.messageは_message.html.hamlであってる？
    var position = target.offset().top + $('.messages').scrollTop();
    $('.messages').animate({
      scrollTop: position
    }, 300, 'swing');
  }
  $('#new_message').on('submit' , function(e){
    e.preventDefault(); //フォーム送信の同期通信のイベントをキャンセルさせるために書いている。
    var formData = new FormData(this);  //フォームに入力した値を取得。var message?
    var url = $(this).attr('action'); //POSTリクエストを送りたいルーティング？
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
  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      var last_message_id = $('.message:last').data("message-id"); //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
      $.ajax({
        url: "api/messages", //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
        type: 'get', //ルーティングで設定した通りhttpメソッドをgetに指定
        dataType: 'json', //dataオプションでリクエストに値を含める
        data: {id: last_message_id},
      })
      .done(function(messages) {
        var insertHTML = '';//追加するHTMLの入れ物を作る
        messages.forEach(function (message) {//配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
          insertHTML = buildHTML(message); //メッセージが入ったHTMLを取得
          $('.messages').append(insertHTML);//メッセージを追加
        })
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');//最新のメッセージが一番下に表示されようにスクロールする。
      })
      .fail(function () {
        alert('自動更新に失敗しました');  //ダメだったらアラートを出す
      });
    }
  };
  setInterval(reloadMessages, 7000);//7000ミリ秒ごとにreloadMessagesという関数を実行し自動更新を行う。
});