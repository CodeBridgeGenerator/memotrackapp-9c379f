
import { faker } from "@faker-js/faker";
export default (user,count,TajukIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
Tajuk: TajukIds[i % TajukIds.length],
Venue: faker.lorem.sentence(""),
Tarikh: faker.date.past(""),
Penganjur: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
