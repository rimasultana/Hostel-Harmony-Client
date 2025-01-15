/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecurity from "@/hooks/axiosSecurity";
import { useDebounce } from "@/hooks/useDebounce";
import InfiniteScroll from "react-infinite-scroller";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Star, Heart, MessageCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/Loading";
import { Link } from "react-router";

const Meals = () => {
  const [axiosSecure] = useAxiosSecurity();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [meals, setMeals] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch initial data and metadata
  const { data: metadata = {}, isLoading: isMetadataLoading } = useQuery({
    queryKey: ["meals-metadata"],
    queryFn: async () => {
      const res = await axiosSecure.get("/meals?page=1&limit=1");
      return {
        categories: res.data.categories,
        priceRange: res.data.priceRange,
      };
    },
  });

  const [priceRange, setPriceRange] = useState([
    metadata?.priceRange?.minPrice || 0,
    metadata?.priceRange?.maxPrice || 1000,
  ]);

  // Update price range when metadata loads
  useEffect(() => {
    if (metadata?.priceRange) {
      setPriceRange([
        metadata.priceRange.minPrice,
        metadata.priceRange.maxPrice,
      ]);
    }
  }, [metadata]);

  // Reset meals when filters change

  const loadMore = async () => {
    if (isLoading) return <LoadingSpinner />;

    try {
      setIsLoading(true);
      const res = await axiosSecure.get("/meals", {
        params: {
          search: debouncedSearch,
          category: selectedCategory === "All" ? "" : selectedCategory,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          page,
          limit: 10,
        },
      });

      const newMeals = res.data.meals;
      setMeals((prevMeals) => [...prevMeals, ...newMeals]);
      setHasMore(newMeals.length === 1);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading meals:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setMeals([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch, selectedCategory, priceRange]);
  const MealCard = ({ meal }) => (
    <Card className="h-full flex flex-col group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex-none p-0">
        <div className="relative">
          <img
            src={meal.image}
            alt={meal.title}
            className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-95 transition-opacity duration-200"
          />
          <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-medium">
                {meal.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg line-clamp-1 hover:text-primary transition-colors">
                {meal.title}
              </CardTitle>
              <Badge variant="secondary" className="mt-1">
                {meal.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {meal.description}
        </p>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-primary">${meal.price}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {meal.likes}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> {meal.reviews_count}
              </Badge>
            </div>
          </div>
          <Link to={`/meal/${meal._id}`}>
            <Button className="w-full group-hover:bg-primary/90 transition-colors">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  if (isMetadataLoading) return <LoadingSpinner />;

  const {
    categories = [],
    priceRange: { minPrice = 0, maxPrice = 1000 } = {},
  } = metadata;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters Section */}
      <div className="bg-muted/50 p-6 rounded-lg mb-8 space-y-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Find Your Perfect Meal</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {meals.length} meals found
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              min={minPrice}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Meals Grid with Infinite Scroll */}
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={
          <div className="text-center py-4" key={0}>
            <LoadingSpinner />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <MealCard key={meal._id} meal={meal} />
          ))}
        </div>
      </InfiniteScroll>

      {meals.length === 0 && !isMetadataLoading && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold">No meals found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default Meals;
