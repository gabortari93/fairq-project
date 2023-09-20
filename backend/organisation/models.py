import hashlib
from datetime import datetime

from django.db import models
from colorfield.fields import ColorField

FONT_CHOICES = [
    ('Arial', 'Arial'),
    ('Helvetica', 'Helvetica'),
    ('Verdana', 'Verdana'),
    ('Trebuchet MS', 'Trebuchet MS'),
    ('Geneva', 'Geneva'),
    ('Roboto', 'Roboto'),
    ('Times New Roman', 'Times New Roman'),
    ('Georgia', 'Georgia'),
    ('Palatino Linotype', 'Palatino Linotype'),
    ('Courier New', 'Courier New'),
]


def logo_file_path(instance, filename):
    if not filename:
        return None

    ext = filename.split('.')[-1]

    if not instance.id:
        file_hash = hashlib.md5(str(datetime.now()).encode()).hexdigest()
        return f"org/unassigned/branding/logo_{file_hash}.{ext}"

    else:
        org_hash = hashlib.md5(str(instance.id).encode()).hexdigest()
        return f"org/{org_hash}/branding/logo.{ext}"


def banner_file_path(instance, filename):
    if not filename:
        return None

    ext = filename.split('.')[-1]

    if not instance.id:
        file_hash = hashlib.md5(str(datetime.now()).encode()).hexdigest()
        return f"org/unassigned/branding/banner_{file_hash}.{ext}"

    else:
        org_hash = hashlib.md5(str(instance.id).encode()).hexdigest()
        return f"org/{org_hash}/branding/banner.{ext}"


class Organisation(models.Model):
    name = models.CharField(max_length=255, verbose_name="Organisation name")
    description = models.TextField(blank=True, null=True, verbose_name="Organisation description")
    website_url = models.URLField(max_length=255, null=False, blank=True, verbose_name="Website")
    contact_url = models.URLField(max_length=255, null=False, blank=True, verbose_name="Contact Website")
    privacy_url = models.URLField(max_length=255, null=False, blank=True, verbose_name="Privacy Website")
    logo = models.ImageField(upload_to=logo_file_path, max_length=255, blank=True, null=True,
                             verbose_name="Logo")
    banner = models.ImageField(upload_to=banner_file_path, max_length=255, blank=True, null=True,
                               verbose_name="Banner")
    font = models.CharField(choices=FONT_CHOICES, max_length=100, default='Arial', verbose_name="Font type")
    background_color = ColorField(format='hex', default='#FFFFFF', verbose_name="Background color")
    font_color = ColorField(format='hex', default='#000000', verbose_name="Font color")
    accent_color = ColorField(format='hex', default='#0000FF', verbose_name="Accent color")
    custom_branding = models.BooleanField(default=False, verbose_name="Enable custom branding?")
    remove_default_branding = models.BooleanField(default=False, verbose_name="Remove fairQ branding?")

    def __str__(self):
        return f"Organisation {self.name} - ID: {self.id}"

    class Meta:
        verbose_name = "organisation"
        verbose_name_plural = "organisations"


def get_owner(self):
    owner_membership = self.organisation_membership.filter(
        role=3).first()  # get the first Membership where role is 'Owner'
    if owner_membership:
        return owner_membership.member.user  # return the associated user
    return None  # return None if no 'Owner' Membership is found
