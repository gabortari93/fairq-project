from waiting_list_field.models import WaitingListField

street_field = WaitingListField(
    name="street",
    section="address",
    order=0,
    type="text",
    label="Street",
    placeholder="Enter a street name and number",
    is_displayed=True,
    is_required=True,
)

zip_field = WaitingListField(
    name="zip",
    section="address",
    order=1,
    type="text",
    label="ZIP code",
    placeholder="Enter a zip code",
    is_displayed=True,
    is_required=True,
)

city_field = WaitingListField(
    name="city",
    section="address",
    order=2,
    type="text",
    label="City",
    placeholder="Enter a city",
    is_displayed=True,
    is_required=True,
)

country_field = WaitingListField(
    name="country",
    section="address",
    order=3,
    type="select",
    label="Country",
    placeholder="Select a country",
    data=[{"ch": "Switzerland"}, {"de": "Germany"}],
    is_displayed=True,
    is_required=True,
)

birthdate_field = WaitingListField(
    name="birthdate",
    section="about",
    order=0,
    type="date",
    label="Birthdate",
    is_displayed=True,
    is_required=True,
)

gender_field = WaitingListField(
    name="gender",
    section="about",
    order=1,
    type="select",
    label="Gender",
    placeholder="Select your gender",
    data=[{"male": "Male"}, {"female": "Female"}, {"other": "Other"}],
    is_displayed=False,
    is_required=True,
)

phone_field = WaitingListField(
    name="phone",
    section="contact",
    order=0,
    type="phone",
    label="Phone number",
    placeholder="+41 79 123 45 67",
    is_displayed=False,
    is_required=True,
)

motivation_field = WaitingListField(
    name="motivation",
    section="motivation",
    order=0,
    type="textarea",
    label="Motivation",
    placeholder="Please enter your motivation",
    is_displayed=True,
    is_required=True,
)

register_for_another_field = WaitingListField(
    name="text",
    section="other",
    order=0,
    type="text",
    label="I am applying for another person",
    placeholder="Name of the person",
    is_displayed=False,
    is_required=False,
)

comment_field = WaitingListField(
    name="comment",
    section="other",
    order=1,
    type="textarea",
    label="Comment",
    placeholder="Anything else that we should know?",
    is_displayed=False,
    is_required=False,
)
