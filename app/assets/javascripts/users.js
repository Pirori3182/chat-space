$(function() {
  function addUser(user){
    let html =  `
    <div class="chat-group-user clearfix">
      <p class="chat-group-user__name">${ user.name }</p>
      <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${ user.id }" data-user-name="${ user.name }">追加</div>
    </div>
    `;
    $("#user-search-result").append(html);  //なんのため？
  }
  function addNoUser(){ // 引数いらないんだ
    let html =  `
        <div class="chat-group-user clearfix">
          <p class="chat-group-user__name">ユーザーが見つかりません</p>
        </div>
    `;
    $("#user-search-result").append(html);
  }
  
  $('#user-search-field').on('keyup' , function(){
    let input = $("#user-search-field").val(); // valメソッドで入力されたものをinputに代入
    $.ajax({
      type: "GET", 
      url: "/users",  
      dataType: 'json',
      data: { keyword: input },   //テキストフィールドに入力された文字を設定する
    })
      .done(function(users){
        $("#user-search-result").empty(); //emptyメソッドで一度検索結果を空にする

        if ( users.length !== 0 ){  //usersが空かどうかで条件分岐。lengthメソッドを使用して条件分岐
          users.forEach(function(user){  //forEach文を使用しusers配列に入っているユーザーごとにHTMLをだす。
            addUser(user);  // 
          });
        } else if( input.length == 0 ){
          return false;  //返り値がない場合。なんでfalseだけでいいのか
        } else {
          addNoUser();
        }
      })
      .fail(function(){
        alert("通信エラーです。ユーザーが表示できません。");
      });
  });

  $(".user-search-add chat-group-user__btn chat-group-user__btn--add").on('click' , function(){
    console.log("追加")
  }
});
