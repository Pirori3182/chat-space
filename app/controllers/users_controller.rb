class UsersController < ApplicationController

  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path      
    else
      render :edit
    end
  end

  def index
    return nil if params[:keyword] == "" #params[:keyword]に値が入っていれば処理を続け、空の場合は処理を終える
    @users = User.where(['name LIKE ?', "%#{params[:keyword]}%"] ).where.not(id: current_user.id).limit(10) # whereメソッドで入力された値を含むかつログインしているユーザーのidは除外
    respond_to do |format|
      format.html
      format.json
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
