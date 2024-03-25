class TodosController < ApplicationController
  before_action :set_todo, except: %i[index new create]

  def index
    @todos = Todo.all.order(:created_at)
  end

  def new
    @todo = Todo.new
    render layout: 'modal'
  end

  def create
    @todo = Todo.new(todo_params)
    if @todo.save
      redirect_to todos_path, notice: 'Todo was successfully created.'
    else
      render :new, layout: 'modal', status: :unprocessable_entity
    end
  end

  def edit
    render layout: 'modal'
  end

  def update
    if @todo.update(todo_params)
      redirect_to todos_path, notice: 'Todo was successfully updated.'
    else
      render :edit, layout: 'modal', status: :unprocessable_entity
    end
  end

  def destroy
    @todo.destroy
    redirect_to todos_path, notice: 'Todo was successfully destroyed.'
  end

  private

  def set_todo
    @todo ||= Todo.find(params[:id])
  end

  def todo_params
    params.require(:todo).permit(:title, :description, :done_at)
  end
end