/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Calendar,
  Package,
  Heart,
  MessageCircle,
  Clock,
  DollarSign,
  Award,
  Star,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/Loading";

const MyProfile = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecurity();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user profile data
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/profile/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch user's meals
  const { data: userMeals = [], isLoading: isMealsLoading } = useQuery({
    queryKey: ["user-meals", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch user's reviews
  const { data: userReviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ["user-reviews", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading || isMealsLoading || isReviewsLoading)
    return <LoadingSpinner />;

  const stats = {
    meals_added: userMeals.length,
    total_likes: userMeals.reduce((sum, meal) => sum + (meal.likes || 0), 0),
    total_reviews: userMeals.reduce(
      (sum, meal) => sum + (meal.reviews_count || 0),
      0
    ),
    avg_rating: userMeals.length
      ? (
          userMeals.reduce((sum, meal) => sum + (meal.rating || 0), 0) /
          userMeals.length
        ).toFixed(1)
      : 0,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="relative">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/150"}
              alt={user?.displayName}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
            />
            {profile.badge && (
              <Badge
                className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                variant="default"
              >
                {profile.badge}
              </Badge>
            )}
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-2">{user?.displayName}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Meals Added</p>
              <p className="text-2xl font-bold">{stats.meals_added}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Likes</p>
              <p className="text-2xl font-bold">{stats.total_likes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reviews Received</p>
              <p className="text-2xl font-bold">{stats.total_reviews}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold">{stats.avg_rating}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meals">My Meals</TabsTrigger>
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Subscription Status */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Subscription Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Plan</span>
                    <Badge
                      variant={
                        profile.subscription?.active ? "default" : "secondary"
                      }
                    >
                      {profile.subscription?.plan || "Free"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        profile.subscription?.active ? "default" : "secondary"
                      }
                    >
                      {profile.subscription?.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {profile.subscription?.expiresAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Expires</span>
                      <span>
                        {new Date(
                          profile.subscription.expiresAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {profile.recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        {activity.type === "meal" && (
                          <Package className="h-4 w-4" />
                        )}
                        {activity.type === "like" && (
                          <Heart className="h-4 w-4" />
                        )}
                        {activity.type === "review" && (
                          <MessageCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meals">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMeals.map((meal) => (
              <Card key={meal._id}>
                <CardContent className="p-0">
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{meal.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{meal.category}</Badge>
                      <span className="text-primary font-medium">
                        ${meal.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{meal.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{meal.reviews_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{meal.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            {userReviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">{review.text}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-4 text-muted-foreground">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProfile;
