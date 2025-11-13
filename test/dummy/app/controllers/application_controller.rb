class ApplicationController < ActionController::Base
  helper_method :alt_confirm_enabled?

  around_action :carry_alt_confirm_param_forward

  private

  def carry_alt_confirm_param_forward
    alt_confirm_value = params[:alt_confirm] || '0'
    yield
    params[:alt_confirm] = alt_confirm_value
  end

  def alt_confirm_enabled?
    params[:alt_confirm] != '0'
  end
end
