import hashlib
from model_utils import FieldTracker

from django.db import models
from django.utils.timezone import now as timezone_now
from applicant.models import Applicant

STATUS_CHOICES = [
    ("pending", "pending"),
    ("verified", "verified"),
    ("declined", "declined"),
    ("expired", "expired"),
]


def file_path(instance, filename):
    if not filename:
        return None

    email = instance.applicant.user.email
    applicant_hash = hashlib.md5(email.encode()).hexdigest()
    file_hash = hashlib.md5(filename.encode()).hexdigest()
    ext = filename.split('.')[-1]
    return f"applicants/{applicant_hash}/verification/{file_hash}.{ext}"


class IdentityVerification(models.Model):
    file_front = models.ImageField(
        upload_to=file_path, max_length=254, blank=True, null=True, verbose_name="Front side"
    )
    file_back = models.ImageField(
        upload_to=file_path, max_length=254, blank=True, null=True, verbose_name="Back side"
    )
    applicant = models.ForeignKey(
        to=Applicant,
        on_delete=models.PROTECT,
        related_name="verifications",
        verbose_name="Applicant",
        null=True,
    )
    status = models.CharField(
        max_length=50, choices=STATUS_CHOICES, default="pending", verbose_name="Status"
    )
    is_valid = models.BooleanField(default=False, verbose_name="Identity verified")
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="Created date")
    updated_date = models.DateTimeField(auto_now=True, verbose_name="Update date")
    expiry_date = models.DateTimeField(null=True, blank=True, verbose_name="Expiry date")
    verification_date = models.DateTimeField(null=True, blank=True, verbose_name="Verification date")
    notification_sent = models.BooleanField(default=False)
    tracker = FieldTracker()

    def __str__(self):
        return f"IdentityVerification #{self.id} for {self.applicant}"

    def save(self, *args, **kwargs):
        is_newly_verified = self.status == "verified" and not self.verification_date
        if is_newly_verified:
            self.status = "verified"
        elif self.expiry_date and self.expiry_date.date() <= timezone_now().date():
            self.status = "expired"
        super(IdentityVerification, self).save(*args, **kwargs)
        if is_newly_verified:
            IdentityVerification.objects.filter(pk=self.pk).update(verification_date=timezone_now())

    class Meta:
        verbose_name = "identity verification document"
        verbose_name_plural = "identity verification documents"
