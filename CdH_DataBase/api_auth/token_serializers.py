from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['roles'] = list(user.groups.values_list("name", flat=True))
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['roles'] = list(self.user.groups.values_list("name", flat=True))
        return data
