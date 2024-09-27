
import { faker } from "@faker-js/faker";
export default (user,count,KategoriIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
NomborRujukan: faker.lorem.sentence(""),
Tajuk: faker.lorem.sentence(""),
Kategori: KategoriIds[i % KategoriIds.length],
Status: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
