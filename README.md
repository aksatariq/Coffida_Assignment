# Coffida Application #

GitHub repo:https://github.com/aksatariq/Coffida_Assignment 
Style Guide: Airbnb


Endpoints implemented, with appropiate error handling.

User Management:
Sign Up - POST /user
Login - POST /user/login
Logout - POST /user/logout
View user details - GET /user/{usr_id}
Update user details - PATCH /user/{usr_id}

Location Reviews:
Add Review - POST /location/{loc_id}/review 
Update Review - PATCH /location/{loc_id}/review/{rev_id}
Delete Review - DELETE /location/{loc_id}/review/{rev_id}
Get Photo - GET /location/{loc_id}/review/{rev_id}/photo 
Add Photo - POST /location/{loc_id}/review/{rev_id}/photo
Delete Photo - DELETE /location/{loc_id}/review/{rev_id}/photo
Like Review - POST /location/{loc_id}/review/{rev_id}/like 
Unlike Review -DELETE /location/{loc_id}/review/{rev_id}/like

Location Management:
Get location details - GET /location/{loc_id} 
Add to favourite location - POST /location/{loc_id}/favourite
Remove from favourite - DELETE /location/{loc_id}/favourite
Find locations - GET /find - Find Locations
