ActionController::Routing::Routes.draw do |map|

  map.connect 'retros/:retro_id/points.:format', :controller =>'points', :action => 'index_for_retro'

  map.root :controller => :retros, :action => :new

  map.connect 'for/:name', :controller =>'deeplinks', :action => 'index_old'
  map.connect 'for/:name/:id', :controller =>'deeplinks', :action => 'index'

  map.connect 'retrospective/for/:name', :controller =>'deeplinks', :action => 'index_old'
  map.connect 'retrospective/for/:name/:id', :controller =>'deeplinks', :action => 'index'

  map.connect 'sections/:section_id/:controller/delete/:id.:format', :action => 'destroy'

  map.connect 'retros/export/:id/:name.:format', :controller => 'retros', :action => 'export'

  map.connect 'admin/show_deleted/:retro_name/:retro_id/devilthegr8', :controller =>'admin', :action => 'deleted_points'
  map.connect 'admin/restore_deleted/:point_id', :controller =>'admin', :action => 'restore_deleted'

  map.resources :votes
  map.resources :points, :has_many => :votes
  map.resources :sections, :has_many => :points
  map.resources :retros, :has_many => :sections

  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
  
end
