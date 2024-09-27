
import { faker } from "@faker-js/faker";
export default (user,count,TajukIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
Tajuk: TajukIds[i % TajukIds.length],
URL: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
