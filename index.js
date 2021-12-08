var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = mongoose.Model,
    ObjectId = Schema.Types.ObjectId;

module.exports = exports = function(schema, options) {
	options = options || {};
  // console.log(options);

  const reactionType = (options.set) ? {type: String, enum: options.set} : {type: String} ;

	schema.add({
		reactions: [
			{
				reaction: reactionType,
				reactBy: ObjectId
			}
		]
	});

	schema.methods.addReaction = function (reactionType, userId) {
		let newReaction = {
			reactBy: userId,
			reaction: reactionType
		};

    // TODO : Verifier si le enum est bon
    const FOUND = this.reactions.find(x => x.reactBy.toString() === userId.toString());
    if(!FOUND){
      this.reactions = this.reactions.concat([newReaction]);
      return this.save();
    }

    return this;
	};

	schema.methods.removeReaction = function (reactionType, userId) {
		for (let i = 0; i < this.reactions.length; i++) {
			let r = this.reactions[i];

			if (r.reactBy && r.reactBy.toString() === userId.toString() && r.reaction === reactionType) {
				this.reactions.pull({_id: r._id});
				return this.save();
			}
		}

		return this;
	};

	schema.methods.toggleReaction = function (reactionType, userId) {
		for (let i = 0; i < this.reactions.length; i++) {
			let r = this.reactions[i];

			if (r.reactBy && r.reactBy.toString() === userId.toString() && r.reaction === reactionType) {
				this.reactions.pull({_id: r._id});
        return this.save();
			}
		}

		let newReaction = {
			reactBy: userId,
			reaction: reactionType
		};

    // TODO : Verifier si le enum est bon
    const FOUND = this.reactions.find(x => x.reactBy.toString() === userId.toString());
    if(!FOUND){
      this.reactions = this.reactions.concat([newReaction]);
      return this.save();
    }

    return this;
	};

};
