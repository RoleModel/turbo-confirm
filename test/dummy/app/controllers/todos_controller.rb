class TodosController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[setup teardown]
  before_action :set_todo, except: %i[index new create setup teardown]

  def setup
    todo1 = Todo.create(title: "Buy milk", done: true, body: "Go to the store!")
    todo2 = Todo.create(title: "Release v2.0.0", done: false, body: "And don't forget to Tweet about it!")
    todo3 = Todo.create(title: "Exercise", done: true, body: "Go for a run in the park!")

    render json: [todo1, todo2, todo3]
  end

  def teardown
    Todo.destroy_all

    head :ok
  end

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
    params.require(:todo).permit(:title, :body, :done)
  end
end
