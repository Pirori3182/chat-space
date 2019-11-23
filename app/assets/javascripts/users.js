$(function() {
  function addUser(user){
    let html =  `
    <div class="chat-group-user clearfix">
      <p class="chat-group-user__name">${ user.name }</p>
      <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${ user.id }" data-user-name="${ user.name }">追加</div>
    </div>
    `;
    $("#user-search-result").append(html);  //上のHTMLデータを出力するため
  }
  function addNoUser(){ // 引数いらないんだ
    let html =  `
        <div class="chat-group-user clearfix">
          <p class="chat-group-user__name">ユーザーが見つかりません</p>
        </div>
    `;
    $("#user-search-result").append(html);
  }
  function addDeleteUser(name, id) {
    let html = `
    <div class="chat-group-user clearfix" id="${id}">
      <p class="chat-group-user__name">${name}</p>
      <div class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn" data-user-id="${id}" data-user-name="${name}">削除</div>
    </div>`;
    $(".js-add-user").append(html);
  }
  function addMember(userId) {
    let html = `<input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />`;
    $(`#${userId}`).append(html);
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
        // alert("通信エラーです。ユーザーが表示できません。");
        console.log("失敗")
      });
  });
  
  $(document).on("click", ".chat-group-user__btn--add", function() { // $(document).on('click', '【セレクタ】', function ()で、常に最新のHTMLの情報を取得することができる
    const userName = $(this).attr("data-user-name");
    const userId = $(this).attr("data-user-id");
    $(this)
      .parent()
      .remove();
    addDeleteUser(userName, userId);
    addMember(userId);
  });
  $(document).on("click", ".chat-group-user__btn--remove", function() {
    $(this)
      .parent()
      .remove();
  });

});
