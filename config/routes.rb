Gorter::Application.routes.draw do
  match '/' => 'retros#new'
  match 'retros/:retro_name/:retro_id/points.:format'=>'points#index_for_retro'

  match 'for/:name'=>'retros#show_old'
  get 'for/:name/:id(.:format)'=>'retros#show', :as => 'retro_for'
  match 'page/:name' => 'pages#show'

  match 'points/delete/:id.:format' =>'points#destroy'

  match 'retros/export/:id/:name.:format'=> 'retros#export', :as => 'export'

  match 'admin/show_deleted/:retro_name/:retro_id/devilthegr8' =>'admin#deleted_points'
  match 'admin/restore_deleted/:point_id' => 'admin#restore_deleted'

  resources :points do
    resources :votes
  end
  resources :retros
  match ':controller/:action/:id'
  match ':controller/:action/:id.:format'
  match "/auth/:provider/callback" => 'session#create'
  match "/signin" => 'session#new', :as => 'signin'
  match "/signout" => 'session#destroy', :as => 'signout'
  match 'user/retros' => 'users#retros'


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
