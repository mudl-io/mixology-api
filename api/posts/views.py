from api.views import JWTAuthViewset
from .serializers import PostSerializer
from .models import Post
from custom_user.models import CustomUser, Follower
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class PostsViewset(JWTAuthViewset):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    @action(methods=["get"], detail=False)
    def has_new_posts(self, request):
        if "time" not in request.query_params:
            return Response(
                data={"has_new_posts": False},
                status=status.HTTP_200_OK,
            )

        queryset = self.get_queryset()
        time = request.query_params["time"]

        new_posts = queryset.filter(created_at__gt=time)

        if new_posts and len(new_posts) > 0:
            return Response(
                data={"has_new_posts": True},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                data={"has_new_posts": False},
                status=status.HTTP_200_OK,
            )

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
