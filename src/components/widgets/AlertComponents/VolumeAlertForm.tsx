
// Fix the frequency value to use the AlertFrequency type
<Select
  value={formData.frequency}
  onValueChange={(value) => setFormData({
    ...formData,
    frequency: value as AlertFrequency
  })}
>
  <SelectTrigger id="frequency">
    <SelectValue placeholder="Select frequency" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="once">Once</SelectItem>
    <SelectItem value="recurring">Recurring</SelectItem>
    <SelectItem value="daily">Daily</SelectItem>
    <SelectItem value="hourly">Hourly</SelectItem>
  </SelectContent>
</Select>
