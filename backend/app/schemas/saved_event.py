from marshmallow import Schema, fields


class SavedEventSchema(Schema):

    id = fields.Int(dump_only=True)

    user_id = fields.Int(dump_only=True)

    external_event_id = fields.Str(required=True)

    source = fields.Str(required=True)

    event_name = fields.Str(required=True)

    event_description = fields.Str()

    venue_name = fields.Str()

    venue_address = fields.Str()

    image_url = fields.Str()

    event_url = fields.Str()

    event_date = fields.Str()

    category = fields.Str()

    saved_at = fields.DateTime(dump_only=True)