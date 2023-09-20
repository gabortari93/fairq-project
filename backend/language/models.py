from django.db import models

LANGUAGES_CHOICES = [
    ("de", "German"),
    ("en", "English"),
    ("hu", "Hungarian"),
]


class Language(models.Model):
    iso_code = models.CharField(max_length=2, choices=LANGUAGES_CHOICES, default="en", verbose_name="Language ISO code",
                                unique=True)

    def __str__(self):
        return self.get_iso_code_display()  # this will display the language name instead of the ISO code

    class Meta:
        verbose_name = "language"
        verbose_name_plural = "languages"
