
    module.exports = function (app) {
        const modelName = 'notify';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            Tajuk: { type: Schema.Types.ObjectId, ref: "latihan" },
Venue: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },
Tarikh: { type: Date, required: false },
Penganjur: { type: String, required: true, unique: false, lowercase: false, uppercase: false, maxLength: null, index: false, trim: false },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };