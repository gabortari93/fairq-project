from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.utils.dateparse import parse_date
import phonenumbers


def has_validation_error(waiting_list_field, value):
    # 'waiting_list_field' is an instance of WaitingListField
    # 'value' is the value you want to validate against the field's requirements

    if waiting_list_field.is_required and value is None:
        return "This field is required."

    if value is None:
        return "Value is none"

    if value is not None:
        if waiting_list_field.type == "select":
            # Validate if value is one of the allowed ones
            choices = [list(item.keys())[0] for item in waiting_list_field.data]
            if value not in choices:
                return f"Invalid value '{value}', valid choices are: {', '.join(choices)}."

        elif waiting_list_field.type == "phone":
            try:
                # Validate phone number
                parsed_number = phonenumbers.parse(value)
                if not phonenumbers.is_valid_number(parsed_number):
                    return f"Number '{value}' is not a valid number."
            except phonenumbers.phonenumberutil.NumberParseException:
                return f"Number '{value}' is not a valid number."

        elif waiting_list_field.type == "date":
            # Validate date
            date_value = parse_date(value)
            if date_value is None:
                return "Invalid date. Expected format is YYYY-MM-DD."

        elif waiting_list_field.type == "email":
            email_validator = EmailValidator()
            try:
                email_validator(value)
            except ValidationError:
                return "Please provide a valid email address"

    return False  # Returns False if there's no validation error
