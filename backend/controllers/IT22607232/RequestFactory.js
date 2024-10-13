// RequestFactory.js
import WasteShedule from '../../models/IT22607232/WasteShedule.model.js';

class RequestFactory {
  static createRequest(data) {
    const {
      Status,
      Additional_Note,
      email,
      Location,
      ScheduleDate,
      Category,
      CustomerName,
      RequestID,
      userId,
    } = data;

    return new WasteShedule({
      Status,
      Additional_Note,
      email,
      Location,
      ScheduleDate,
      Category,
      CustomerName,
      RequestID,
      userId,
    });
  }
}

export default RequestFactory;
