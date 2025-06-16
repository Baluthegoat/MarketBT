-- Insert sample products (you'll need to replace vendor_id with actual user IDs)
INSERT INTO products (name, description, price, image_url, vendor_id) VALUES
('Fresh Apples', 'Crispy red apples from local orchard. Perfect for snacking or baking.', 3.99, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', '00000000-0000-0000-0000-000000000000'),
('Organic Tomatoes', 'Vine-ripened organic tomatoes. Great for salads and cooking.', 4.50, 'https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=400', '00000000-0000-0000-0000-000000000000'),
('Homemade Bread', 'Freshly baked sourdough bread. Made with organic flour.', 6.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', '00000000-0000-0000-0000-000000000000'),
('Local Honey', 'Pure wildflower honey from local beekeepers. Raw and unfiltered.', 12.99, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', '00000000-0000-0000-0000-000000000000'),
('Farm Eggs', 'Free-range chicken eggs from happy hens. Rich and nutritious.', 5.50, 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400', '00000000-0000-0000-0000-000000000000');

-- Note: Replace '00000000-0000-0000-0000-000000000000' with actual user IDs from your auth.users table
-- You can get user IDs by running: SELECT id FROM auth.users;
