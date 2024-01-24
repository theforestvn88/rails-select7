class DevelopersController < ApplicationController
  before_action :set_developer, only: %i[ show edit update destroy ]

  # GET /developers
  def index
    @developers = Developer.all
  end

  def search
    render json: Developer.where("name like ?", "%#{params[:name]}%")
  end

  # GET /developers/1
  def show
  end

  # GET /developers/new
  def new
    @developer = Developer.new
  end

  # GET /developers/1/edit
  def edit
  end

  # POST /developers
  def create
    @developer = Developer.new(developer_params)

    if @developer.save
      redirect_to @developer, notice: "Developer was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /developers/1
  def update
    if @developer.update(developer_params)
      redirect_to @developer, notice: "Developer was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /developers/1
  def destroy
    @developer.destroy
    redirect_to developers_url, notice: "Developer was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_developer
      @developer = Developer.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def developer_params
      params.require(:developer).permit(:name)
    end
end
