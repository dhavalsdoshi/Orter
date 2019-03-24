Rails.application.routes.draw do

# Serve websocket cable requests in-process
  mount ActionCable.server => '/cable'

  get '/' => 'retros#new'
  get 'retros/:retro_name/:retro_id/points.:format'=>'points#index_for_retro'

  get 'for/:name'=>'retros#show_old'
  get 'for/:name/:id(.:format)'=>'retros#show', :as => 'retro_for'
  get 'page/:name' => 'pages#show'

  get 'points/delete/:id.:format' =>'points#destroy'

  get 'retros/export/:id/:name.:format'=> 'retros#export', :as => 'export'

  get 'admin/show_deleted/:retro_name/:retro_id/devilthegr8' =>'admin#deleted_points'
  get 'admin/restore_deleted/:point_id' => 'admin#restore_deleted'

  resources :points do
    resources :votes
  end
  resources :retros
  get ':controller/:action/:id'
  get ':controller/:action/:id.:format'
  get "/auth/:provider/callback" => 'session#create'
  get "/signin" => 'session#new', :as => 'signin'
  get "/signout" => 'session#destroy', :as => 'signout'
  get 'user/retros' => 'users#retros'
  root 'retros#new'
end
