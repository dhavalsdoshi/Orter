Rails.application.routes.draw do
  get '/' => 'retros#new'
  get 'retros/:retro_name/:retro_id/points.:format'=>'points#index_for_retro'

  get 'for/:name/:id(.:format)'=>'retros#show', :as => 'retro_for'
  get 'page/:name' => 'pages#show'

  get 'points/delete/:id.:format' =>'points#destroy'

  get 'retros/export/:id/:name.:format'=> 'retros#export', :as => 'export'

  get 'admin/show_deleted/:retro_name/:retro_id/devilthegr8' =>'admin#deleted_points'
  get 'admin/restore_deleted/:point_id' => 'admin#restore_deleted'

  resources :points do
    resources :votes
  end

  # API Routes
  post 'api/retros(.:format)' => 'retros#create'
  post 'api/retros/:retro_id/:retro_name/sections' => 'sections#new'
  put 'api/retros/:retro_id/:retro_name/:section/:id' => 'sections#update'
  get 'api/retros/:id/:name(.:format)' => 'retros#show'
  post 'api/retros/:retro_id/:retro_name/sections/:section_id/points(.:format)' => 'points#create'
  delete 'api/retros/:retro_id/:retro_name/sections/:section_id/points/:id(.:format)' => 'points#destroy'
  put 'api/retros/:retro_id/:retro_name/sections/:section_id/points/:id(.:format)' => 'points#update'
  post 'api/retros/:retro_id/:retro_name/sections/:section_id/points/:point_id/votes(.:format)' => 'votes#create'

  resources :retros do
    post 'remove_from_my_board', on: :member
  end
  get '/terms' => "site#tnc"
  get ':controller/:action/:id'
  get ':controller/:action/:id.:format'
  get "/auth/:provider/callback" => 'session#create'
  get "/signin" => 'session#new', :as => 'signin'
  get "/signout" => 'session#destroy', :as => 'signout'
  get 'user/retros' => 'users#retros'
  root 'retros#new'
end
