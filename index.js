var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = mongoose.Model;

module.exports = exports = function(schema, options) {
	options = options || {};
  // console.log(options);

  const reactionType = (options.set) ? {type: String, enum: options.set} : {type: String};
  const userModel = (options.userModel) ? options.userModel : 'User';

	schema.add({
		reactions: [
			{
				reaction: reactionType,
				reactBy: {type: Schema.Types.ObjectId, ref: userModel}
			}
		]
	});

  /**
   *
   * @returns Array
   */
  schema.methods.getAvailableReactions = function () {
    return (options.set) ? options.set : {message: 'No restrictions with the reactions'};
	};


  /**
   *
   * @returns Object
   */
  schema.methods.getReactions = function () {
    const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})
    return groupByKey(this.reactions, 'reaction');
	};


  /**
   *
   * @param {*} reactionType
   * @param {*} userId
   * @returns Object
   */
	schema.methods.addReaction = function (reactionType, userId) {
    if(options.set && !options.set.includes(reactionType)){
      throw new Error('This reaction is not allowed on this document');
    }

		const newReaction = {
			reactBy: userId,
			reaction: reactionType
		};

    const FOUND = this.reactions.find(x => x.reactBy.toString() === userId.toString() && x.reaction === reactionType);
    if(!FOUND){
      this.reactions = this.reactions.concat([newReaction]);
      return this.save();
    }

    return this;
	};


  /**
   *
   * @param {*} reactionType
   * @param {*} userId
   * @returns Object
   */
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


  /**
   *
   * @param {*} reactionType
   * @param {*} userId
   * @returns Object
   */
	schema.methods.toggleReaction = function (reactionType, userId) {
    if(options.set && !options.set.includes(reactionType)){
      throw new Error('This reaction is not allowed on this document');
    }

		for (let i = 0; i < this.reactions.length; i++) {
			let r = this.reactions[i];

			if (r.reactBy && r.reactBy.toString() === userId.toString() && r.reaction === reactionType) {
				this.reactions.pull({_id: r._id});
        return this.save();
			}
		}

		const newReaction = {
			reactBy: userId,
			reaction: reactionType
		};

    const FOUND = this.reactions.find(x => x.reactBy.toString() === userId.toString() && x.reaction === reactionType);
    if(!FOUND){
      this.reactions = this.reactions.concat([newReaction]);
      return this.save();
    }

    return this;
	};

};
