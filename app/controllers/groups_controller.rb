class GroupsController < ApplicationController
  before_action :set_group, only: [:edit, :update]
  
  def index
  end

  def new
    @group = Group.new  #@groupというインスタンス変数を定義
    @group.users << current_user  #現在ログイン中のユーザーを、新規作成したグループに追加
  end

  def create
    @group = Group.new(group_params)
    if @group.save
      redirect_to root_path, notice: 'グループを作成しました'  #HTTPリクエストをサーバーに送り、ユーザーはそこから返ってくるHTMLが表示される
    else 
      render :new  #HTTPリクエストを送らず、該当するビューだけを表示
    end
  end

  def update
    if @group.update(group_params)
      redirect_to group_messages_path(@group), notice: 'グループを編集しました'
    else
      render :edit
    end
  end

  private

  def group_params
    params.require(:group).permit(:name, { :user_ids => [] }) #グループ名を記入していない状態での保存ができない,同じ名前のグループが作成できない
  end

  def set_group
    @group = Group.find(params[:id])
  end
end
