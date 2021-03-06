class MessagesController < ApplicationController
  before_action :set_group

  def index #投稿されたメッセージの一覧表示 & メッセージの入力ができる
    @message = Message.new #Messageモデルの新しいインスタンス
    @messages = @group.messages.includes(:user) #グループに所属する全てのメッセージ
  end

  def create #メッセージの保存を行う
    @message = @group.messages.new(message_params)
    if @message.save
      # redirect_to group_messages_path(@group), notice: 'メッセージが送信されました'
      respond_to do |format|
        format.html { redirect_to "group_messages_path(params[:group_id])" }
        format.json
      end
    else 
      @messages = @group.messages.includes(:user) #n+1問題
      # flash.now[:alert] = 'メッセージを入力してください。'
      render :index
    end
  end

  private

  def message_params
    params.require(:message).permit(:content, :image).merge(user_id: current_user.id) #グループ名を記入していない状態での保存ができない,同じ名前のグループが作成できない
  end

  def set_group
    @group = Group.find(params[:group_id]) #messagesコントローラの全てのアクションで@groupを利用できる
  end
end
