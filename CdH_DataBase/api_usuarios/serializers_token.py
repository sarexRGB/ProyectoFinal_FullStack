from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email

        # Obtiene el primer grupo del usuario (o none)
        groups = list(user.groups.values_list('name', flat=True))
        token['groups'] = groups
        return token