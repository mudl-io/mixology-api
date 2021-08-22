from api.views import JWTAuthViewset
from .serializers import PostSerializer
from .models import Post
from custom_user.models import CustomUser, Follower


class PostsViewset(JWTAuthViewset):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get_queryset(self):
        if not self.request.user or self.request.user.is_anonymous:
            return super().get_queryset()

        posts = []

        if (
            "default" in self.request.query_params
            and self.request.query_params["default"] == "true"
        ):
            excluded_user_ids = [x for x in self.request.user.following] + [
                self.request.user.id
            ]
            posts = Post.objects.exclude(posted_by__id__in=excluded_user_ids)
        elif "username" in self.request.query_params:
            posts = Post.objects.filter(
                posted_by__username=self.request.query_params["username"]
            )
        else:
            followed_users_ids = Follower.objects.filter(
                follower=self.request.user
            ).values_list("followee", flat=True)

            posts = Post.objects.filter(posted_by__id__in=followed_users_ids)

        return posts.order_by("created_at").reverse()
