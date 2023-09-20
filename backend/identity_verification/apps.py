from django.apps import AppConfig


class IdentityVerificationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "identity_verification"

    def ready(self):
        import identity_verification.signals  # noqa: F401
